import { api } from "../helpers/request.helper";

describe("AppController (e2e)", () => {
  it("/ (GET)", () => {
    return api().get("/").expect(200).expect("Hello World!");
  });
});
