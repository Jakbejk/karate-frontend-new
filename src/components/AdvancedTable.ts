import {inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ColDef, GridReadyEvent, IDatasource, IGetRowsParams, themeQuartz} from 'ag-grid-community';
import {HttpParams} from '@angular/common/http';
import {Page} from '../commons/PageTools';
import {GetHttpClient} from '../commons/RestTools';


const CS_LOCALE: Record<string, string> = {
  // Filter conditions – text
  contains: 'Obsahuje',
  notContains: 'Neobsahuje',
  equals: 'Rovná se',
  notEqual: 'Nerovná se',
  startsWith: 'Začíná na',
  endsWith: 'Končí na',
  // Filter conditions – number / date
  lessThan: 'Méně než',
  lessThanOrEqual: 'Méně nebo rovno',
  greaterThan: 'Více než',
  greaterThanOrEqual: 'Více nebo rovno',
  inRange: 'Mezi',
  // Common filter
  blank: 'Prázdné',
  notBlank: 'Neprázdné',
  filterOoo: 'Filtrovat...',
  applyFilter: 'Použít',
  resetFilter: 'Resetovat',
  clearFilter: 'Vymazat',
  cancelFilter: 'Zrušit',
  andCondition: 'A',
  orCondition: 'NEBO',
  // Date filter
  dateFormatOoo: 'dd.mm.rrrr',
  // Grid
  loadingOoo: 'Načítání...',
  noRowsToShow: 'Žádné záznamy',
  // Pagination
  page: 'Stránka',
  nextPage: 'Další stránka',
  lastPage: 'Poslední stránka',
  firstPage: 'První stránka',
  previousPage: 'Předchozí stránka',
  pageSizeSelectorLabel: 'Velikost stránky:',
  // Column menu
  sortAscending: 'Seřadit vzestupně',
  sortDescending: 'Seřadit sestupně',
  columns: 'Sloupce',
  filters: 'Filtry',
};

export class AdvancedTable<T> {

  columnDefs: ColDef[];
  readonly theme = themeQuartz;
  readonly defaultColDef: ColDef<T> = {
    sortable: true,
    filter: false
  }
  readonly pageSize = 20;
  private uri: string;
  private translate = inject(TranslateService);
  private http = new GetHttpClient<Page<T>>();

  constructor(uri: string, columnDefs: ColDef[]) {
    this.uri = uri;
    this.columnDefs = columnDefs.map(col => {
      if (col.headerValueGetter && typeof col.headerValueGetter === 'string') {
        const headerPath = col.headerValueGetter;
        col.headerValueGetter = () => this.translate.instant(headerPath);
      }
      return col;
    });
  }

  get localeText(): Record<string, string> | undefined {
    return this.translate.currentLang === 'cs' ? CS_LOCALE : undefined;
  }

  onGridReady(event: GridReadyEvent): void {
    const datasource: IDatasource = {
      getRows: (params: IGetRowsParams) => {
        const page = params.startRow / this.pageSize;

        let httpParams = new HttpParams()
          .set('page', page)
          .set('size', this.pageSize);

        if (params.sortModel.length > 0) {
          httpParams = httpParams
            .set('sort', params.sortModel[0].colId + "," + (params.sortModel[0].sort ?? 'asc'))
        }

        for (const [field, model] of Object.entries(params.filterModel) as [string, any][]) {
          httpParams = httpParams.set(field + 'FilterType', model.type);
          if (model.filterType === 'date') {
            if (model.dateFrom) httpParams = httpParams.set(field + 'From', model.dateFrom);
            if (model.dateTo) httpParams = httpParams.set(field + 'To', model.dateTo);
          } else if (model.filter !== undefined && model.filter !== null) {
            httpParams = httpParams.set(field, model.filter);
          }
        }

        this.http.GET(this.uri, {params: httpParams}).subscribe({
          next: (data) => params.successCallback(data.content, data.totalRecords),
          error: (e) => params.failCallback(),
        });
      },
    };

    event.api.setGridOption('datasource', datasource);
  }
}
