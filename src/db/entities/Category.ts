import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { File } from "./File";
import { Product } from "./Product";

@Index("Category_Name_Active_idx", ["active", "name"], { unique: true })
@Index("Category_SequenceId_Active_idx", ["active", "sequenceId"], {
  unique: true,
})
@Index("Category_pkey", ["categoryId"], { unique: true })
@Entity("Category", { schema: "dbo" })
export class Category {
  @PrimaryGeneratedColumn({ type: "bigint", name: "CategoryId" })
  categoryId: string;

  @Column("bigint", { name: "SequenceId", default: () => "0" })
  sequenceId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("character varying", { name: "Desc" })
  desc: string;

  @Column("boolean", { name: "Active", default: () => "true" })
  active: boolean;

  @ManyToOne(() => File, (file) => file.categories)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: File;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
