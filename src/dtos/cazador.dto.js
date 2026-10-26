export class CredencialesDTO {
  constructor(data = {}) {
    this.username = String(data.username ?? "").trim().toLowerCase();
    this.password = String(data.password ?? "");
  }
}
