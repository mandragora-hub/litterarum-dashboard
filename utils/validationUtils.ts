import { object, number, string } from "yup";

const generics = {
  bookSchema: () => {
    return object({
      title: string().required(),
      wordCount: number().required(),
      pages: number().required(),
      downloaded: number().notRequired(),
      views: number().notRequired(),
    });
  },
  authorSchema: () => {
    return object({
      name: string().required(),
      alias: string(),
      photoUrl: string(),
    });
  },
};

export default {
  generics,
};
