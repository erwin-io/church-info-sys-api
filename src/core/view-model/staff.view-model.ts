import { Staff } from "src/shared/entities/Staff";
import { GenderViewModel } from "./gender.view-model";
import { UserViewModel } from "./user.view-model";

export class StaffViewModel {
  staffid: string;
  email: string;
  mobileNumber: string;
  fullName: string;
  gender: GenderViewModel;
  user: UserViewModel;
  constructor(model: Staff | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.staffid = model.staffid;
    this.fullName = model.name;
    this.email = model.email;
    this.mobileNumber = model.mobileNumber;
    this.gender = model.gender;
    this.user = new UserViewModel(model.user);
  }
}
