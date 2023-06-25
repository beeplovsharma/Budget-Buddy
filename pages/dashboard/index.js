const add = document.getElementById("add-expense");
const expenseList = document.getElementById("expense-list");
const totalExpense = document.getElementById("total-expense");
const totalSaving = document.getElementById("total-saving");
const totalInvestment = document.getElementById("total-investment");
const yearlySaving = document.getElementById("yearly-saving");
const expenseTitle = document.getElementById("expense-name");
const expenseAmount = document.getElementById("expense-amount");
const expenseType = document.getElementById("expense-type");
const userName = document.getElementById("name");
const savingTillNow = document.getElementById("saving-till-now");

let expenses = [];
let editExpense = null;
const ctx = document.getElementById("myChart");

  

add.addEventListener("click", (e) => {
  if(expenseTitle.value===""||expenseAmount.value==="")return
  e.preventDefault();
  console.log("clicked");
  const expense = {
    title: expenseTitle.value,
    amount: expenseAmount.value,
    type: expenseType.value,
    date: new Date().toLocaleDateString(),
    id: new Date().getTime().toString(),
  };

  if (editExpense === null) {
    expenses.push(expense);
    renderAlert("Expense Added", "success");
  } else {
    editExpense.title = expenseTitle.value;
    editExpense.amount = expenseAmount.value;
    editExpense.type = expenseType.value;
    editExpense.date = new Date().toLocaleDateString();
    editExpense.id = new Date().getTime().toString();
    renderAlert("Expense Updated", "success");
  }

  expenseType.type = "";
  expenseTitle.value = "";
  expenseAmount.value = "";
  saveExpenses();
  renderExpenses();
  updateChart()
  editExpense = null;
});

// Delete & Edit Expense
expenseList.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.classList.contains("delete-btn")) {
    const title = e.target.dataset.title;
    deleteExpense(title);
    saveExpenses();
    renderExpenses();
    renderAlert("Expense Deleted", "success");
  }

  if (e.target.classList.contains("edit-btn")) {
    const title = e.target.dataset.title;
    editExpenseFunc(title);
  }
});
// Get Expenses from localStorage
const getExpenses = () => {
  const expensesJSON = localStorage.getItem("expenses");
  try {
    expenses = JSON.parse(expensesJSON) || [];
  } catch (e) {
    expenses = [];
  }
};

// Save Expenses to localStorage
const saveExpenses = () => {
  localStorage.setItem("expenses", JSON.stringify(expenses));
};

// Delete Expense
const deleteExpense = (title) => {
  expenses = expenses.filter((expense) => expense.id !== title);
  updateChart()
};

// Edit Expense
const editExpenseFunc = (title) => {
  editExpense = expenses.find((expense) => expense.id === title);

  expenseTitle.value = editExpense.title;
  expenseAmount.value = editExpense.amount;
  expenseType.value = editExpense.type;
};

// Get Total Expense
const getTotalExpense = () => {
  const total = expenses
    .filter((ele) => ele.type === "Expense")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
  totalExpense.innerHTML = total ? total : 0;
};

// Get Total Credit
const getTotalSaving = () => {
  const total = expenses
    .filter((ele) => ele.type === "Credit")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
  totalSaving.innerHTML = total ? total : 0;
};
// Get Total Investment
const getTotalInvestment = () => {
  const total = expenses
    .filter((ele) => ele.type === "Investment")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
  totalInvestment.innerHTML = total ? total : 0;
};
// Get Total Credit
const getYearlySaving = () => {
  const totalCredit = expenses
    .filter((ele) => ele.type === "Credit")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
  const totalExpense = expenses
    .filter((ele) => ele.type === "Expense")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
const totalInvestment = expenses
    .filter((ele) => ele.type === "Investment")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
  const total = totalCredit - totalExpense + totalInvestment;
  yearlySaving.innerHTML = total ? total * 12 : 0;
};
const getsavingTillNow = () => {
    const totalCredit = expenses
    .filter((ele) => ele.type === "Credit")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
  const totalExpense = expenses
    .filter((ele) => ele.type === "Expense")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0);
   const totalInvestment = expenses
    .filter((ele) => ele.type === "Investment")
    .reduce((acc, curr) => acc + parseInt(curr.amount), 0); 
  const total = totalCredit - totalExpense + totalInvestment;
    savingTillNow.innerHTML = total ? total : 0;
}
// Render Expenses
const renderExpenses = () => {
  expenseList.innerHTML = "";
  getTotalExpense();
  getTotalInvestment();
  getTotalSaving();
  getYearlySaving();
  getsavingTillNow()

  expenses.forEach((expense) => {
    const div = document.createElement("div");
    if (expense.type === "Investment") {
      div.classList.add("investment");
    } else if (expense.type === "Credit") {
      div.classList.add("saving");
    } else {
      div.classList.add("expense");
    }
    div.classList.add("history-item");
    div.innerHTML = `
        <div class="expense-item">
          <h4>${expense.title}</h4>
          <h4>$${expense.amount}</h4>
        </div>
        <div class="expense-item">
        <h4>${expense.type}</h4>
        <h4>${expense.date}</h4>
          </div>
          <div class="history-btn-container">
            <button class="edit-btn" data-title="${expense.id}">Edit<img class='edit-png' src="../../assets/edit.png"/></button>
            <button class="delete-btn" data-title="${expense.id}">Delete<img class='delete-png' src="../../assets/delete.png"/></button>
          </div>
      `;
    expenseList.appendChild(div);
  });
};

// Render Alert
const renderAlert = (message, type) => {
  console.table(message, type);
};

// Initialize
const init = () => {
  getExpenses();
  renderExpenses();
};
init();
const chart = CreateChart();
function CreateChart() {
    const chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Expences", "Saving", "Investment"],
          datasets: [
            {
              label: "# of Votes",
              data: [
                totalExpense.innerHTML,
                totalSaving.innerHTML,
                totalInvestment.innerHTML,
              ],
              backgroundColor: ["rgb(255, 106, 106)", "rgb(106, 255, 106)", "rgb(106, 106, 255)"],
              borderWidth: 1,
            },
          ],
        },
        options: {
            responsive: true,
            title:{
                display: true,
                text: "Color test"
            }
        },
        
      });
      return chart;
      
}
function updateChart() {
  chart.data.datasets[0].data = [
    totalExpense.innerHTML,
    totalSaving.innerHTML,
    totalInvestment.innerHTML,
  ];
    chart.update();
}
