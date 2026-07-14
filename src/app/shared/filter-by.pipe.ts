import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filterBy' })
export class FilterByPipe implements PipeTransform {
  transform<T extends Record<string, any>>(items: T[], term: string, fields: string[]): T[] {
    if (!items) return [];
    if (!term) return items;
    const lower = term.toLowerCase();
    return items.filter(item =>
      fields.some(field => String(item[field] ?? '').toLowerCase().includes(lower))
    );
  }
}
