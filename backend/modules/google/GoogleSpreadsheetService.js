import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import google_creds from './service_account_snet-404216-828f4810e5c3.json' with { "type": "json" }

import AesEncryption from "../privacy/aes_encryption.js";
const aes = new AesEncryption("2af790aa2ea83f941974d0f3ebdb3f4714912f31a19090237dff63ef4ed7011" + "F");

const serviceAccountAuth = new JWT({
    // env var values here are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    email: google_creds.client_email,
    key: google_creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const PUBLIC_INDEX = 3;
const USER_INDEX = 0;

class GoogleSheetService {
    // The static instance will hold the singleton instance of the class
    // static instance;

    constructor() {
        // if (GoogleSheetService.instance) {
        //     return GoogleSheetService.instance;
        // }

        // Singleton pattern: initialize the instance only once
        // GoogleSheetService.instance = this;

        this.setup('1ZLmQ4vw5-PcQgdQuzVcqwjw4CwPvQUo8nfhaWH3UJi4')
    }

    // Set up and authenticate the Google Spreadsheet
    async setup(ss_id = this.SPREADSHEET_ID) {
        this.SPREADSHEET_ID = ss_id;
        this.doc = new GoogleSpreadsheet(ss_id, serviceAccountAuth);
        await this.doc.loadInfo();
        console.log('Google Sheet setup complete!');
    }

    // Access the sheet object (used in CRUD operations)
    async accessSheet(index = 0) {
        if (!this.doc) {
            await this.setup();
        }
        return this.doc.sheetsByIndex[index];
    }

    // CREATE - Add a new row to the sheet
    async createRow(data) {
        const sheet = await this.accessSheet();
        await sheet.addRow(data);
        console.log('Row added:', data);
    }

    // READ - Get all rows from the sheet
    async readRows(sheet_index = 0) {
        const sheet = await this.accessSheet(sheet_index);
        const rows = await sheet.getRows();
        console.log('Rows fetched:', rows);
        const json_values = rows.map(r => r._rawData.slice(PUBLIC_INDEX));
        const json_keys = sheet.headerValues.slice(PUBLIC_INDEX); // remove user, pass, iv
        console.log(json_values, json_keys);
        const json_row = json_keys.reduce((acc, key, index) => {
            acc[key] = json_values[index] || null; // Handle cases where values array is shorter than keys
            return acc;
        }, {});
        console.log("struct read", json_row);

        return { headers: json_keys, rows: json_values };
    }

    // UPDATE - Update an existing row (based on a column value)
    async updateRow(filterValue, updateData, args) {
        const { user_pass, iv, tempo_atualizacao } = args;
        console.log(updateData);
        const sheet = await this.accessSheet();
        console.log("sheet", sheet)
        const rows = await sheet.getRows();
        console.log("rows", rows, filterValue)
        const row_result = rows.filter(row => row._rawData[USER_INDEX] === filterValue); // Assuming 'username' is the unique identifier
        const row = row_result[0];
        console.log("row", row_result, row, row_result[0]._rawData, sheet.headerValues)
        const json_values = row_result[0]._rawData;
        const json_keys = sheet.headerValues;
        const json_row = json_keys.reduce((acc, key, index) => {
            acc[key] = json_values[index] || null; // Handle cases where values array is shorter than keys
            return acc;
        }, {});
        console.log("struct", json_row, "password\n\n", user_pass, "iv\n\n", iv, "json_password\n\n", json_row.password, "json_iv\n\n", json_row.iv);

        //pass auth
        // const front_decrypt = await aes.decrypt(user_pass, iv);
        const server_decrypt = await aes.decrypt(json_row.password, json_row.iv);
        console.log("server_decrypt", server_decrypt, json_row, json_row.password)
        if (!server_decrypt.match(user_pass)) {
            const err = new Error("wrong password");
            err.statusCode = 403;
            throw err;
        }

        if (row) {
            updateData.tempo_atualizacao = tempo_atualizacao;
            console.log(updateData);
            row.assign(updateData);
            await row.save();
            console.log('Row updated:', row_result);
            return true;
        } else {
            console.log('Row not found.');
            return false;
        }
    }

    // DELETE - Delete a row based on a condition
    async deleteRow(filterValue) {
        const sheet = await this.accessSheet();
        const rows = await sheet.getRows();
        const row = rows.find(r => r.username === filterValue); // Assuming 'username' is the unique identifier
        if (row) {
            await row.delete();
            console.log('Row deleted:', row);
        } else {
            console.log('Row not found.');
        }
    }
}

export { GoogleSheetService };
export default new GoogleSheetService()
