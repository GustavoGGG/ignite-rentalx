import { container } from "tsyringe";
import { DayjsDateProvider } from "./implementations/DayjsDateProvider";
import { IDateProvider } from "./protocols/IDateProvider";
container.registerSingleton<IDateProvider>(
  "DayjsDateProvider",
  DayjsDateProvider
)

