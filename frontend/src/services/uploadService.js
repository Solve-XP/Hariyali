import api from "../api/axios";

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
              (file) =>
                file.type
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

          const response =
            await fetch(

              upload.upload_url,

              {
                method:
                  "PUT",

                headers:
                  {
                    "Content-Type":
                      files[
                        index
                      ].type,
                  },

                body:
                  files[
                    index
                  ],
              }
            );

          if (
            !response.ok
          ) {

            throw new Error(
              "Failed to upload image"
            );
          }
        }
      )
    );

    return uploads.map(
      (
        upload
      ) =>
        upload.file_url
    );
  },
};