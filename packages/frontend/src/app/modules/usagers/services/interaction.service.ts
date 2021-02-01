import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "../../../../environments/environment";
import { UsagerLight } from "../../../../_common/model";
import { LoadingService } from "../../loading/loading.service";
import { UsagerFormModel } from "../components/form/UsagerFormModel";
import { Interaction } from "../interfaces/interaction";

@Injectable({
  providedIn: "root",
})
export class InteractionService {
  public http: HttpClient;
  public loading: boolean;
  public endPoint = environment.apiUrl + "interactions/";

  constructor(http: HttpClient, private loadingService: LoadingService) {
    this.http = http;
    this.loading = true;
  }

  public setInteraction(
    usager: UsagerLight | UsagerFormModel,
    interaction?: any
  ): Observable<UsagerLight> {
    /* Procuration */
    return this.http
      .post<UsagerLight>(`${this.endPoint}${usager.ref}`, interaction)
      .pipe();
  }

  public getInteractions(usagerRef: number): Observable<Interaction[]> {
    return this.http.get(`${this.endPoint}${usagerRef}/10`).pipe(
      map((response) => {
        return Array.isArray(response)
          ? response.map((item) => new Interaction(item))
          : [new Interaction(response)];
      })
    );
  }
  public delete(usagerRef: number, interactionId: number) {
    return this.http.delete(`${this.endPoint}${usagerRef}/${interactionId}`);
  }
}
