import { ICarsImagesRepository } from "@modules/cars/repositories/protocols/ICarsImagesRepository";
import { inject, injectable } from "tsyringe";
import { deleteFile } from "@utils/file"

interface IRequest {
  car_id: string;
  images_name: string[]
}
@injectable()
class UploadCarImagesUseCase {

  constructor(
    @inject("CarsImagesRepository")
    private carsImagesRepository: ICarsImagesRepository
  ) {

  }
  async execute({ car_id, images_name }: IRequest): Promise<void> {
    images_name.map(async (image) => {
      // if (image) {
      //   await deleteFile(`./tmp/cars/${image}`)
      // }
      await this.carsImagesRepository.create({ car_id, image_name: image });
    })
  }

}

export { UploadCarImagesUseCase }