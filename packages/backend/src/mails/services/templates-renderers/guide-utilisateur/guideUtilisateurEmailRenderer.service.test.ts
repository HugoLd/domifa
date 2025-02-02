import * as fs from "fs";
import * as path from "path";
import { format } from "prettier";
import { domifaConfig } from "../../../../config";
import { guideUtilisateurEmailRenderer } from "./guideUtilisateurEmailRenderer.service";
describe("guideUtilisateurEmailRenderer", () => {
  it("guideUtilisateurEmailRenderer render ", async () => {
    const model = {
      prenom: "Paul",
      lienGuide: "https://domifa/guide",
    };
    const { subject, text, html } =
      await guideUtilisateurEmailRenderer.renderTemplate(model);

    expect(subject).toEqual(`[DOMIFA] Découvrez le guide utilisateur DomiFa !`);
    expect(text).toContain(model.prenom);
    expect(text).toContain(model.lienGuide);

    if (domifaConfig().envId === "local") {
      await fs.promises.writeFile(
        path.join(
          __dirname,
          "../../../../_static/email-templates",
          "guide-utilisateur",
          "test.tmp.html"
        ),
        html
      );
    }

    const refHtml = await fs.promises.readFile(
      path.join(
        __dirname,
        "../../../../_static/email-templates",
        "guide-utilisateur",
        "test.ref.html"
      ),
      "utf-8"
    );
    expect(format(refHtml, { parser: "html" })).toEqual(
      format(html, { parser: "html" })
    );
  });
});
