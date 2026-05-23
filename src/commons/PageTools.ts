export class Page<T> {
  public totalRecords: number = 0;
  public content: T[] = [];
}

export class Pageable {
  public page: number = 0;
  public size: number = 0;
}
