import { db } from "@/lib/db";

export const getCategories = async () => {
  try {
    const categories = await db.category.findMany();

    return categories;
  } catch (error) {
    console.error(error);
    return [];
  }
};
