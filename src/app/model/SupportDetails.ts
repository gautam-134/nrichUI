export class SupportDetails {
  image!: string;
  title!: string;
  subTitle!: string;
  description!: string;

  constructor(
    image: string,
    title: string,
    subTitle: string,
    description: string
  ) {
    this.image = image;
    this.title = title;
    this.subTitle = subTitle;
    this.description = description;
  }
}
