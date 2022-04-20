import { IMailProvider } from "../protocols/IMailProvider";
import nodemailer, { Transporter } from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";

class EtherealMailProvider implements IMailProvider {
  private client: Transporter
  constructor() {
    // nodemailer.createTestAccount().then((account) => {
    //   const transporter = nodemailer.createTransport({
    //     host: account.smtp.host,
    //     port: account.smtp.port,
    //     secure: account.smtp.secure,
    //     auth: {
    //       user: account.user,
    //       pass: account.pass
    //     }
    //   })
    //   this.client = transporter
    // }).catch(error => console.error(error))
    this.createClient()
  }

  private async createClient() {
    try {
      const account = await nodemailer.createTestAccount();

      this.client = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });
    } catch (err) {
      console.error(`EtherealMailProvider - Error:\n${err}`);
    }
  }
  async sendMail(to: string, subject: string, variables: any, path: string): Promise<void> {
    if (!this.client) {
      await this.createClient();
    }
    const templateFileContent = fs.readFileSync(path).toString("utf-8")

    const templateParse = handlebars.compile(templateFileContent)

    const templateHtml = templateParse(variables)
    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreplay@rentx.com.br>",
      subject,
      html: templateHtml
    })
    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message))

  }

}

export { EtherealMailProvider }