'use strict';

// You need to add access for ngx-sheet-translation-sync@tractr-internal.iam.gserviceaccount.com to the GoogleSheet.

const util = require('util');
const path = require('path');
const fs = require('fs');
const { google } = require('googleapis');
const credentials = require('./credentials');
const config = require('./config');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const jwtClient = new google.auth.JWT(
	credentials.client_email,
	null,
	credentials.private_key,
	SCOPES,
	null
);
const sheets = google.sheets({ version: 'v4', auth: jwtClient });

// promisified callback-based functions
const exec = util.promisify(require('child_process').exec);
const readFile = util.promisify(fs.readFile);
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const getSheetPromise = util.promisify(sheets.spreadsheets.values.get);
const appendSheetPromise = util.promisify(sheets.spreadsheets.values.append);
const batchUpdateSheetPromise = util.promisify(sheets.spreadsheets.batchUpdate);

// config
const masterLang = config.masterLang;
const spreadsheetId = config.spreadsheetId;
const i18nFolder = './src/assets/i18n/';
const appDir = path.dirname(path.dirname(__dirname));

// state
let langs = [];
let validHeaderValues = ['KEY'];
let remoteHeaderLangs;

async function runExtract() {
	await exec(
		appDir +
			'/node_modules/.bin/ngx-translate-extract -m _ --input ./src --output ./src/assets/i18n/*.json --clean --sort --format namespaced-json'
	);
}

async function getLocal() {
	const langFiles = (await readDir(i18nFolder)).filter(file => {
		if (file.indexOf('.json') !== -1 && file.indexOf('keys') !== 0) {
			const lang = file.split('.')[0];
			langs.push(lang);
			validHeaderValues.push(lang.toUpperCase());
			return true;
		} else {
			console.warn('WARNING: This file is not a valid lang file');
			return false;
		}
	});

	console.log(`Got files: ${langFiles.join(', ')}`);
	console.log(`Got langs: ${langs.join(', ')}`);
	console.log(`Valid header values: ${validHeaderValues.join(', ')}`);

	const rawData = {};

	for (let i = 0; i < langFiles.length; i++) {
		rawData[langs[i]] = JSON.parse(
			await readFile(i18nFolder + '/' + langFiles[i])
		);
	}

	let data = {};

	Object.keys(rawData[masterLang]).map(key => {
		data[key] = {};
		for (let i = 0; i < langs.length; i++) {
			data[key][langs[i]] = rawData[langs[i]][key];
		}
	});
	console.log(`Local rows: ${Object.keys(data).length}`);

	return data;
}
async function getRemote() {
	const res = await getSheetPromise({
		spreadsheetId,
		range: 'i18n!A1:E5000'
	});

	return [
		sheetsValuesToObj(res.data.values.slice()),
		res.data.values.slice()
	];
}

function sheetsValuesToObj(values) {
	let obj = {};

	// validate header
	const header = values.shift();
	remoteHeaderLangs = header.slice(1).map(h => h.toLowerCase());

	const validHeader =
		JSON.stringify(header.slice().sort()) ===
		JSON.stringify(validHeaderValues.slice().sort());
	if (!validHeader) {
		throw new Error('Invalid remote header:' + header);
	}
	console.log('Remote header is valid');
	if (header[1] !== masterLang.toUpperCase()) {
		throw new Error('Invalid remote header master lang:' + header);
	}
	console.log('Remote header master language is valid (' + masterLang + ')');

	// loop values
	values.map(v => {
		obj[v[0]] = {};

		remoteHeaderLangs.map((lang, i) => {
			obj[v[0]][lang] = v[i + 1] || '';
		});
	});

	console.log(`Remote rows: ${Object.keys(obj).length}`);

	return obj;
}

function compareKeys(a, b) {
	let keysNotInB = [];

	Object.keys(a).map(key => {
		if (typeof b[key] === 'undefined') {
			keysNotInB.push(key);
		}
	});

	return keysNotInB;
}

async function appendRemoveRemoteRows(
	keysToAdd,
	keysToRemove,
	localData,
	rawRemoteData
) {
	if (keysToAdd.length === 0) {
		console.log('No local row absent in remote');
	} else {
		console.log(keysToAdd.length + ' local rows absent in remote');

		const values = keysToAdd.map(key => {
			const values = [];

			remoteHeaderLangs.map(lang => {
				values.push(localData[key][lang]);
			});

			return [key].concat(values);
		});

		await appendSheetPromise({
			spreadsheetId,
			range: 'i18n!A1:E5000',
			includeValuesInResponse: false,
			valueInputOption: 'RAW',
			resource: { values }
		});
	}
	if (keysToRemove.length === 0) {
		console.log('No remote row absent in local');
	} else {
		console.log(keysToRemove.length + ' remote rows absent in local');

		const requests = keysToRemove
			.map(keyToRemove => {
				return rawRemoteData.reduce((range, row, i) => {
					if (range) {
						return range;
					}
					if (keyToRemove === row[0]) {
						const rowId = i + 1;
						return {
							deleteDimension: {
								range: {
									sheetId: 0,
									dimension: 'ROWS',
									startIndex: rowId - 1,
									endIndex: rowId
								}
							}
						};
					}
				}, null);
			})
			.reverse();

		await batchUpdateSheetPromise({
			spreadsheetId,
			resource: { requests }
		});
	}
}

async function writeRemoteToLocal(updatedRemoteData) {
	const files = {};
	files['keys'] = {};

	Object.keys(updatedRemoteData).map(key => {
		const values = updatedRemoteData[key];
		files['keys'][key] = key;
		Object.keys(values).map(lang => {
			if (!files[lang]) {
				files[lang] = {};
			}
			files[lang][key] = values[lang];
		});
	});

	const langs = Object.keys(files);

	for (let i = 0; i < langs.length; i++) {
		const lang = langs[i];
		await writeFile(
			i18nFolder + '/' + lang + '.json',
			JSON.stringify(files[lang], null, 4)
		);
	}
}

(async () => {
	console.log(`Starting sync`);
	await runExtract();
	const localData = await getLocal();
	const [remoteData, rawRemoteData] = await getRemote();
	const keysToAdd = compareKeys(localData, remoteData);
	const keysToRemove = compareKeys(remoteData, localData);
	await appendRemoveRemoteRows(
		keysToAdd,
		keysToRemove,
		localData,
		rawRemoteData
	);
	const [updatedRemoteData] = await getRemote();
	await writeRemoteToLocal(updatedRemoteData);
	console.log(`Sync done`);
})().catch(console.error);
