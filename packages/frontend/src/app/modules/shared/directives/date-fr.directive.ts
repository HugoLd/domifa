import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[dateFr]",
})
export class DateFrDirective {
  public inputElement: HTMLElement;
  private navigationKeys = [
    "Backspace",
    "Delete",
    "Tab",
    "Escape",
    "Enter",
    "Home",
    "Space",
    "End",
    "ArrowLeft",
    "ArrowRight",
    "Clear",
    "Copy",
    "Paste",
  ];
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener("keydown", ["$event"])
  public onKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    if (typeof e.target === "undefined") {
      return;
    }
    const dateValue = target.value;

    if (
      this.navigationKeys.indexOf(e.key) > -1 ||
      (e.key === "a" && e.ctrlKey === true) ||
      (e.key === "c" && e.ctrlKey === true) ||
      (e.key === "v" && e.ctrlKey === true) ||
      (e.key === "x" && e.ctrlKey === true) ||
      (e.key === "a" && e.metaKey === true) ||
      (e.key === "c" && e.metaKey === true) ||
      (e.key === "v" && e.metaKey === true) ||
      (e.key === "x" && e.metaKey === true)
    ) {
      return;
    }
    if ((isNaN(Number(e.key)) && e.key !== "/") || e.keyCode === 32) {
      e.preventDefault();
    }

    if (e.key === "/") {
      if (
        dateValue.substring(dateValue.length - 1) === "/" ||
        (dateValue.length !== 2 && dateValue.length !== 5)
      ) {
        e.preventDefault();
      }
    }
  }

  @HostListener("keyup", ["$event"])
  public onKeyUp(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    const dateValue = target.value;

    if (e.key !== "Backspace") {
      if (dateValue.length === 2 || dateValue.length === 5) {
        (<HTMLInputElement>e.target).value = dateValue + "/";
      }
    }
  }

  @HostListener("paste", ["$event"])
  public onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData("text/plain")
      .replace(/[^0-9/-]+/g, "");
    document.execCommand("insertText", false, pastedInput);
  }

  @HostListener("drop", ["$event"])
  public onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer
      .getData("text")
      .replace(/[^0-9/-]+/g, "");
    this.inputElement.focus();
    document.execCommand("insertText", false, textData);
  }
}
