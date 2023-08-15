import { ParsedFile } from "@foxkit/node-util/fs-extra";

export class DataFile<T> extends ParsedFile<T> {
  limitPath: string;
  constructor(limitPath: string) {
    super({
      stringify: JSON.stringify,
      parse: v => JSON.parse(v),
      cache: true,
      limitPath
    });
    this.limitPath = limitPath;
  }

  async read() {
    const res = await this.readFile(this.limitPath);
    if (!res.success) throw res.error;
    return res.data;
  }

  async write(data: T) {
    return this.writeFile(this.limitPath, data);
  }
}
