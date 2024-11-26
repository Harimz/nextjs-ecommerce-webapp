import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_S3_REGION || "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

export const uploadFileToS3 = async (
  file: Buffer,
  filename: string,
  contentType: string
): Promise<string> => {
  const fileBuffer = file;
  const uniqueFileName = `${filename}-${Date.now()}`;

  const params = {
    Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const fileUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${uniqueFileName}`;

  return fileUrl;
};

export const removeFileFromS3 = async (fileUrl: string) => {
  try {
    const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;

    const key = fileUrl.split(
      `https://${bucketName}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/`
    )[1];

    const params = {
      Bucket: bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);

    return { success: true };
  } catch (error) {
    console.error("REMOVE_IMAGE_ERROR: ", error);
    return { error: "Could not remove image" };
  }
};
