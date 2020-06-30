import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { notifyWithSnackBar } from '@spend-book/core/store/notification/notification.actions';
// import { subscriptionEditorDialogId } from '@spend-book/shared/constants';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { Subscription } from '../../model/subscription';
import { SubscriptionService } from '../../services/subscription.service';
import {
  addSubscription,
  addSubscriptionSuccess,
  loadSubscriptionsByUser,
  loadSubscriptionsByUserSuccess,
  removeSubscription,
  removeSubscriptionSuccess,
  updateSubscription,
  updateSubscriptionSuccess
} from './subscription.actions';

@Injectable()
export class SubscriptionEffects {

  loadSubscriptionsByBook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadSubscriptionsByUser),
      switchMap(action =>
        this.subscriptionService.loadSubscriptionsByUser(action.userId).pipe(
          map((subscriptions: Subscription[]) => loadSubscriptionsByUserSuccess({ subscriptions })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '账本记录载入失败，请稍后重试' } })))
        ))
    )
  );

  addSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addSubscription),
      mergeMap(action =>
        this.subscriptionService.addSubscription(action.subscription).pipe(
          map((subscription: Subscription) => {
            this.closeSubscriptionEditor();
            return addSubscriptionSuccess({ subscription });
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '记账失败，请稍后重试' } })))
        ))
    )
  );

  updateSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSubscription),
      mergeMap(action =>
        this.subscriptionService.updateSubscription(action.subscription).pipe(
          map((subscription: Subscription) => {
            this.closeSubscriptionEditor();
            return updateSubscriptionSuccess({ update: { id: subscription.id, changes: subscription } });
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '编辑失败，请稍后重试' } })))
        ))
    )
  );

  removeSubscription$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeSubscription),
      mergeMap(action =>
        this.subscriptionService.removeSubscription(action.id).pipe(
          map(() => {
            this.closeSubscriptionEditor();
            return removeSubscriptionSuccess();
          }),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '删除失败，请稍后重试' } })))
        ))
    )
  );

  closeSubscriptionEditor() {
    // const subscriptionEditor = this.matDialog.getDialogById(subscriptionEditorDialogId);
    // if !(!subscriptionEditor) {
    //   subscriptionEditor.close();
    // }
  }

  constructor(
    private actions$: Actions,
    private subscriptionService: SubscriptionService,
    private matDialog: MatDialog
  ) {
  }
}
