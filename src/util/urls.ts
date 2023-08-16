export function getServantIconUrl(fileName: string, bordered?: boolean) {
  const url = `https://static.atlasacademy.io/JP/Faces/${fileName}`;
  if (!bordered) return url;
  return url.replace(/\.png$/, "_bordered.png");
}
