import { Dictionary } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Category } from '@spend-book/core/model/category';
import { Transaction } from '@spend-book/core/model/transaction';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import * as fromTransaction from '@spend-book/core/store/transaction/transaction.reducer';
import { RootState } from '@spend-book/core/store';
import { selectCategoryEntities } from '../category';


 const getSelectedTransactionId = (state: fromTransaction.State) => state.selectedTransactionId;
 // const getTransactionIdsByDate = (state: fromTransaction.State) => state.transactionIdsByDate;


export const selectTransactionState = createFeatureSelector<RootState, fromTransaction.State>(
  fromTransaction.transactionFeatureKey
);

//  const selectTransactionEntitiesState = createSelector(
//   selectSpendBookState,
//   state => state.transaction
// );

export const selectSelectedTransactionId = createSelector(
  selectTransactionState,
  getSelectedTransactionId
);

export const selectTransactionIdsByDate = createSelector(
  selectTransactionState,
  // getTransactionIdsByDate,
  (state: fromTransaction.State) => state.transactionIdsByDate
)

const {
  selectIds: selectTransactionIds,
  selectEntities: selectTransactionEntities,
  selectAll: selectAllTransactions,
  selectTotal: selectTransactionTotal,
} = fromTransaction.adapter.getSelectors(selectTransactionState);

export const selectAllTransactionVOs = createSelector(selectCategoryEntities,
  selectAllTransactions,
  (categories: Dictionary<Category>, transactions: Transaction[]) => {
    if (Object.keys(categories).length <= 0 || transactions.length <= 0) {
      return [];
    }
    return transactions
    .map((transaction: Transaction) =>
      new TransactionVO({
        ...transaction,
        categoryName: categories[transaction.categoryId].name,
        description: transaction.description,
        icon: categories[transaction.categoryId].icon
      })
    )
    // 先按 transactionDate，再按 dateModified，较新的放前面
    .sort((a: TransactionVO, b: TransactionVO) =>
      b.transactionDate.valueOf() - a.transactionDate.valueOf() ||
      b.dateModified.valueOf() - a.dateModified.valueOf()
    )
  }
);

export const selectAllTransactionVOsByYearMonth = createSelector(
  selectAllTransactionVOs,
  (transactionVOs: TransactionVO[], props: { displayMonth: Date }) => {
    const year: number = props.displayMonth.getFullYear();
    const month: number = props.displayMonth.getMonth();
    return transactionVOs.filter(
      (transactionVO: TransactionVO) => transactionVO.transactionDate.getFullYear() === year &&
        transactionVO.transactionDate.getMonth() === month
    );
  }
);

export const getTransactionIdsByDate = createSelector(
  selectTransactionEntities,
  selectTransactionIdsByDate,
  (transactionEntities: Dictionary<Transaction>, transactionIdsByDate, props: { date: string }) => {
    const summary = {
      income: 0,
      spend: 0
    };
    transactionIdsByDate[props.date].forEach(id => {
      const transaction = transactionEntities[id];
      if (transaction.amount > 0) {
        summary.income += transaction.amount;
      } else {
        summary.spend -= transaction.amount;
      }
    })
    return summary;
  }
);