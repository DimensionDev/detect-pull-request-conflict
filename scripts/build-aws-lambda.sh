#!/bin/bash
set -x
rimraf dist
ncc build --minify src/aws-lambda.ts
cp private-key.pem dist
rm ../lambda.zip
(cd dist; zip ../lambda.zip -r *)
