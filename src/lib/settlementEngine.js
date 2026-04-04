export const computeBalances = (members, expenses) => {
    const balances = {};
  
    members.forEach(m => {
      balances[m._id] = 0;
    });
  
    expenses.forEach(exp => {
      const splitAmount = exp.amount / exp.split.length;
  
      balances[exp.paidBy._id] += exp.amount;
  
      exp.split.forEach(userId => {
        balances[userId] -= splitAmount;
      });
    });
  
    return balances;
  };
  
   export const computeSettlements = (balances) => {
    const debts = [];
    const credits = [];
  
    Object.entries(balances).forEach(([id, balance]) => {
      if (balance < -0.01) {
        debts.push({ id, amount: Math.abs(balance) });
      } else if (balance > 0.01) {
        credits.push({ id, amount: balance });
      }
    });
  
    debts.sort((a,b)=>b.amount-a.amount);
    credits.sort((a,b)=>b.amount-a.amount);
  
    const result = [];
  
    let i = 0, j = 0;
  
    while (i < debts.length && j < credits.length) {
      const amount = Math.min(debts[i].amount, credits[j].amount);
  
      result.push({
        from: debts[i].id,
        to: credits[j].id,
        amount: Number(amount.toFixed(2)),
      });
  
      debts[i].amount -= amount;
      credits[j].amount -= amount;
  
      if (debts[i].amount < 0.01) i++;
      if (credits[j].amount < 0.01) j++;
    }
  
    return result;
  };
  
