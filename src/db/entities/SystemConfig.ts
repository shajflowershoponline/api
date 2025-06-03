import { Column, Entity, Index } from "typeorm";

@Index("SystemConfig_pkey", ["key", "value"], { unique: true })
@Entity("SystemConfig", { schema: "dbo" })
export class SystemConfig {
  @Column("character varying", { primary: true, name: "Key" })
  key: string;

  @Column("character varying", { primary: true, name: "Value" })
  value: string;
}
