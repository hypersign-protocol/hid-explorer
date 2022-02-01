import { useState } from 'react';
import {
  useTransactionsListenerSubscription,
  TransactionsListenerSubscription,
} from '@graphql/types';
import { TransactionsState } from './types';

export const useTransactions = () => {
  const [state, setState] = useState<TransactionsState>({
    items: [],
  });

  // ================================
  // txs subscription
  // ================================
  useTransactionsListenerSubscription({
    onSubscriptionData: (data) => {
      setState({
        items: formatTransactions(data.subscriptionData.data),
      });
    },
  });

  const formatTransactions = (data: TransactionsListenerSubscription) => {
    return data.transactions.map((x) => {
      return ({
        height: x.height,
        hash: x.hash,
        success: x.success,
        timestamp: Date.now().toString(), //x.block.timestamp TODO: We need to figure out how to get the timestamp from the block
        messages: x.messages.length,
      });
    });
  };

  return {
    state,
  };
};
