import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./Category";
import { Collection } from "./Collection";
import { Discounts } from "./Discounts";
import { GiftAddOns } from "./GiftAddOns";
import { Product } from "./Product";
import { ProductImage } from "./ProductImage";

@Index("pk_files_901578250", ["fileId"], { unique: true })
@Entity("File", { schema: "dbo" })
export class File {
  @PrimaryGeneratedColumn({ type: "bigint", name: "FileId" })
  fileId: string;

  @Column("text", { name: "FileName" })
  fileName: string;

  @Column("text", { name: "Url", nullable: true })
  url: string | null;

  @Column("text", { name: "GUID" })
  guid: string;

  @OneToMany(() => Category, (category) => category.thumbnailFile)
  categories: Category[];

  @OneToMany(() => Collection, (collection) => collection.thumbnailFile)
  collections: Collection[];

  @OneToMany(() => Discounts, (discounts) => discounts.thumbnailFile)
  discounts: Discounts[];

  @OneToMany(() => GiftAddOns, (giftAddOns) => giftAddOns.thumbnailFile)
  giftAddOns: GiftAddOns[];

  @OneToMany(() => Product, (product) => product.thumbnailFile)
  products: Product[];

  @OneToMany(() => ProductImage, (productImage) => productImage.file)
  productImages: ProductImage[];
}
