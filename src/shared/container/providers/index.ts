import { container } from "tsyringe";
import { DayjsDateProvider } from "./DateProvider/implementations/DayjsDateProvider";
import { IDateProvider } from "./DateProvider/protocols/IDateProvider";
import { EtherealMailProvider } from "./MailProvider/implementations/EtherealMailProvider";
import { IMailProvider } from "./MailProvider/protocols/IMailProvider";
import { LocalStorageProvider } from "./StorageProvider/implementations/LocalStorageProvider";
import { IStorageProvider } from "./StorageProvider/protocols/IStorageProvider";

container.registerSingleton<IDateProvider>(
  "DayjsDateProvider",
  DayjsDateProvider
)

container.registerInstance<IMailProvider>(
  "EtherealMailProvider",
  new EtherealMailProvider()
)

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  LocalStorageProvider
)
