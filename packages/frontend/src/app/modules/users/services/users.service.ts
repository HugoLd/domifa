import { ApiMessage } from "./../../../../_common/model/_core/ApiMessage.type";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import {
  UsagerLight,
  UserStructure,
  UserStructureEditProfile,
  UserStructureProfile,
  UserStructureRole,
} from "../../../../_common/model";
import { userStructureBuilder } from "./userStructureBuilder.service";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private endPoint = environment.apiUrl + "users";

  constructor(private readonly http: HttpClient) {}

  public getUser(id: number): Observable<UserStructure> {
    return this.http.get(`${this.endPoint}/${id}`).pipe(
      map((response) => {
        return userStructureBuilder.buildUserStructure(response);
      })
    );
  }

  public validateEmail(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.endPoint}/validate-email`, {
      email,
    });
  }

  public patch(userInfos: UserStructureEditProfile): Observable<UserStructure> {
    return this.http.patch(`${this.endPoint}`, userInfos).pipe(
      map((response) => {
        return userStructureBuilder.buildUserStructure(response);
      })
    );
  }

  public getUsers(): Observable<UserStructureProfile[]> {
    return this.http.get(`${this.endPoint}`).pipe(
      map((response) => {
        return Array.isArray(response)
          ? response.map((item) =>
              userStructureBuilder.buildUserStructure(item)
            )
          : [userStructureBuilder.buildUserStructure(response)];
      })
    );
  }

  public updateRole(
    id: number,
    role: UserStructureRole
  ): Observable<UserStructureProfile> {
    return this.http
      .patch(`${this.endPoint}/update-role/${id}`, {
        role,
      })
      .pipe(
        map((response) => {
          return userStructureBuilder.buildUserStructure(response);
        })
      );
  }

  public deleteUser(id: number): Observable<ApiMessage> {
    return this.http.delete<ApiMessage>(`${this.endPoint}/${id}`);
  }

  public getPasswordToken(data: string) {
    return this.http.post(`${this.endPoint}/get-password-token`, data);
  }

  public getLastPasswordUpdate(): Observable<Date> {
    return this.http.get<Date>(`${this.endPoint}/last-password-update`);
  }

  public checkPasswordToken({
    userId,
    token,
  }: {
    userId: string;
    token: string;
  }) {
    return this.http.get(
      `${this.endPoint}/check-password-token/${userId}/${token}`
    );
  }

  public resetPassword(data: { email: string }) {
    return this.http.post(`${this.endPoint}/reset-password`, data);
  }

  public updatePassword(data: {
    confirmPassword: string;
    password: string;
    token: string;
    userId: number;
  }): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.endPoint}/edit-password`, data);
  }

  public registerUser(data: string): Observable<ApiMessage> {
    return this.http.post<ApiMessage>(`${this.endPoint}/register`, data);
  }

  public agenda(): Observable<UsagerLight[] | []> {
    return this.http.get(`${environment.apiUrl}agenda`).pipe(
      map((response) => {
        return Array.isArray(response) ? response : [response];
      })
    );
  }
}
