#!/bin/env node

const https = require("https");
const camelcaseKeys = require("camelcase-keys");
const fs = require("fs");
const path = require("path");

(async () => {
  // Obtain the css schema
  const originalSchema = await new Promise((success, fail) => {
    https.get(
      "https://raw.githubusercontent.com/rcorp/css-schema/master/cssschema.json",
      (res) => {
        let data = "";
        res
          .on("data", (c) => {
            data += c;
          })
          .on("end", () => {
            success(JSON.parse(data));
          })
          .on("error", fail);
      }
    );
  });

  // Camelcase the properties
  const newSchema = Object.assign({}, originalSchema, {
    properties: camelcaseKeys(originalSchema.properties),
  });

  // Write out the schema
  fs.writeFileSync(
    path.resolve(__dirname, "../object-css.schema.json"),
    JSON.stringify(newSchema, null, 2)
  );

  console.log("Done");
})();
