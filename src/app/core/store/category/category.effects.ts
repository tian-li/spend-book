import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { Category } from '../../model/category';
import { CategoryService } from '../../services/category.service';
import {
  addCategory,
  addCategorySuccess,
  loadCategoriesByUser,
  loadCategoriesByUserSuccess,
  removeCategory,
  removeCategorySuccess,
  updateCategory,
  updateCategorySuccess
} from './category.actions';

@Injectable()
export class CategoryEffects {

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCategoriesByUser),
      switchMap(() =>
        this.categoryService.loadCategoriesByUser().pipe(
          map((categories: Category[]) => loadCategoriesByUserSuccess({ categories })),
        ))
    )
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCategory),
      mergeMap(action =>
        this.categoryService.addCategory(action.category).pipe(
          map((category: Category) => addCategorySuccess({ category })),
        ))
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCategory),
      mergeMap(action =>
        this.categoryService.updateCategory(action.category).pipe(
          map((category: Category) => updateCategorySuccess({ update: { id: category.id, changes: category } })),
        ))
    )
  );

  removeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCategory),
      mergeMap(action =>
        this.categoryService.removeCategory(action.id).pipe(
          map(() => removeCategorySuccess()),
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService
  ) {
  }
}
