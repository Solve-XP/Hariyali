import api from "../api/axios";
import * as FileSystem from "expo-file-system/legacy";

export const UploadService = {

  async getUploadUrls(
    folder,
    files
  ) {

    const response =
      await api.post(
        "/uploads/presigned-urls",
        {
          folder,
          content_types:
            files.map(
              (file) => file.type
            ),
        }
      );

    return response.data;
  },

  async uploadFilesToS3(
    files,
    uploads
  ) {

    await Promise.all(

      uploads.map(
        async (
          upload,
          index
        ) => {

          const file =
                  files[index];

          const result =
            await FileSystem.uploadAsync(

              upload.upload_url,

              file.uri,

              {
                httpMethod:
                  "PUT",

                uploadType:
                  FileSystem
                    .FileSystemUploadType
                    .BINARY_CONTENT,

                headers: {
                  "Content-Type":
                    file.type,
                },
              }
            );


          if (
            result.status !== 200
          ) {

            throw new Error(
              `S3 upload failed: ${result.status}`
            );
          }
        }
      )
    );

    return uploads.map(
      (upload) =>
        upload.file_url
    );
  },
};