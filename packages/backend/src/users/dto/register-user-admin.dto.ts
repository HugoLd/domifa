import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";
import { UserStructureRole } from "../../_common/model";
import { Transform, TransformFnParams } from "class-transformer";

export class RegisterUserAdminDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @MinLength(2, {
    message: "PRENOM_TOO_SMALL",
  })
  @MaxLength(100, {
    message: "PRENOM_TOO_LONG",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => {
    return value.toString().trim();
  })
  public readonly prenom!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @MinLength(2, {
    message: "NOM_TOO_SMALL",
  })
  @MaxLength(100, {
    message: "NOM_TOO_LONG",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => {
    return value.toString().trim();
  })
  public readonly nom!: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  public readonly email!: string;

  @ApiProperty({
    type: String,
    required: true,
    enum: ["admin", "simple", "facteur", "responsable"],
  })
  @IsNotEmpty()
  @IsIn(["admin", "simple", "facteur", "responsable"])
  public readonly role!: UserStructureRole;

  @IsOptional()
  public structureId!: number;
}
