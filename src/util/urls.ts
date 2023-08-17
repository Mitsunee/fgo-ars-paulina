export function getServantIconUrl(fileName: string, bordered?: boolean) {
  const url = `https://static.atlasacademy.io/JP/Faces/${fileName}`;
  if (!bordered) return url;
  return url.replace(/\.png$/, "_bordered.png");
}

export function getSkillIconUrl(fileName: string) {
  return `https://static.atlasacademy.io/JP/SkillIcons/${fileName}`;
}
