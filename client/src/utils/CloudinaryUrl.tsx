export const getCloudinaryUrl = (path: string | undefined) => {
  if (!path) return "https://placehold.co/400x300?text=No+Image+Path";
  
  if (path.startsWith("http")) return path;

  const cloudName = "dprsygcvh";

  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/articles/${path}`;
}
export default getCloudinaryUrl;