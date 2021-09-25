const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 300;
exports.getUrlHandler = async (event, context) => {
  // console.log("REGION: ", process.env.AWS_REGION);

  return await getUploadURL(event);
};

const getUploadURL = async function (event) {
  const randomID = parseInt(Math.random() * 10000000);
  const Key = `${randomID}.jpg`;

  // Get signed URL from S3
  const s3Params = {
    Bucket: process.env.UPLOAD_BUCKET,
    Key,
    Expires: URL_EXPIRATION_SECONDS,
    ContentType: "image/jpeg",
    // This ACL makes the uploaded object publicly readable.
    ACL: "public-read",
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
  const response = {
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
    },
    body: JSON.stringify({
      uploadURL: uploadURL,
      publicURL: `https://${process.env.UPLOAD_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`,
    })
  };

  // console.info("Params: ", s3Params);
  // console.info("response: ", response);

  return response;
};
