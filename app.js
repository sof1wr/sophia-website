// app.js

document.addEventListener("DOMContentLoaded", function () {
  const equationCountInput = document.getElementById("equation-count");
  const variableCountInput = document.getElementById("variable-count");
  const coefficientTableBody = document.getElementById("coefficient-table-body");
  const submitButton = document.getElementById("submit-button");

  submitButton.addEventListener("click", function () {
    const numEquations = parseInt(equationCountInput.value);
    const numVariables = parseInt(variableCountInput.value);
  
    const coefficients = [];
    for (let i = 0; i < numEquations; i++) {
      const equationCoefficients = [];
      for (let j = 0; j < numVariables; j++) {
        const input = document.getElementById(`coefficient-${i}-${j}`);
        equationCoefficients.push(parseFloat(input.value));
      }
      equationCoefficients.push(parseFloat(document.getElementById(`constant-${i}`).value)); // Add constant term
      coefficients.push(equationCoefficients);
    }
  
    displayMatrixDimension(numEquations, numVariables);
    displayEquationMatrix(coefficients);
    solveEquations(coefficients);
    const inverseMatrix = findInverse(coefficients);
    displayInverse(inverseMatrix);
  });
  

  equationCountInput.addEventListener("input", createCoefficientInputs);
  variableCountInput.addEventListener("input", createCoefficientInputs);

  function createCoefficientInputs() {
    const numEquations = parseInt(equationCountInput.value);
    const numVariables = parseInt(variableCountInput.value);
  
    coefficientTableBody.innerHTML = "";
  
    for (let i = 0; i < numEquations; i++) {
      const row = document.createElement("tr");
  
      for (let j = 0; j < numVariables; j++) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.id = `coefficient-${i}-${j}`;
        input.type = "number";
        input.step = "any";
        cell.appendChild(input);
        row.appendChild(cell);
      }
  
      // Add an additional cell for the constant term
      const constantCell = document.createElement("td");
      const constantInput = document.createElement("input");
      constantInput.id = `constant-${i}`;
      constantInput.type = "number";
      constantInput.step = "any";
      constantCell.appendChild(constantInput);
      row.appendChild(constantCell);
  
      coefficientTableBody.appendChild(row);
    }
  }

   // Initialize coefficient inputs and constant inputs with default value of 0
   createCoefficientInputs();

   function createCoefficientInputs() {
    const numEquations = parseInt(equationCountInput.value);
    const numVariables = parseInt(variableCountInput.value);
  
    coefficientTableBody.innerHTML = "";
  
    for (let i = 0; i < numEquations; i++) {
      const row = document.createElement("tr");
  
      for (let j = 0; j < numVariables; j++) {
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.id = `coefficient-${i}-${j}`;
        input.type = "number";
        input.step = "any";
        input.value = "0"; // Set default value to 0
        cell.appendChild(input);
        row.appendChild(cell);
      }
  
      // Add an additional cell for the constant term
      const constantCell = document.createElement("td");
      const constantInput = document.createElement("input");
      constantInput.id = `constant-${i}`;
      constantInput.type = "number";
      constantInput.step = "any";
      constantInput.value = "0"; // Set default value to 0
      constantCell.appendChild(constantInput);
      row.appendChild(constantCell);
  
      coefficientTableBody.appendChild(row);
    }
  }
  

function displayEquationMatrix(coefficients) {
  const equationMatrixOutput = document.getElementById("equation-matrix-output");

  const matrixTable = document.createElement("table");
  const matrixBody = document.createElement("tbody");

  for (const row of coefficients) {
    const tableRow = document.createElement("tr");

    for (let i = 0; i < row.length - 1; i++) {
      const tableCell = document.createElement("td");
      tableCell.textContent = row[i];
      tableRow.appendChild(tableCell);
    }

    const constantCell = document.createElement("td");
    constantCell.textContent = row[row.length - 1]; // Get the last element as the constant
    tableRow.appendChild(constantCell);

    matrixBody.appendChild(tableRow);
  }

  matrixTable.appendChild(matrixBody);
  equationMatrixOutput.appendChild(matrixTable);
}

  
function displayMatrixDimension(numEquations, numVariables) {
  const dimensionOutput = document.getElementById("dimension-output");
  dimensionOutput.textContent = `${numEquations}x${numVariables + 1}`;
}
 

function solveEquations(coefficients) {
  const solutionOutput = document.getElementById("solution-output");

  const numEquations = coefficients.length;
  const numVariables = coefficients[0].length - 1; // Subtract 1 to exclude the constant term

  const augmentedMatrix = coefficients.map(row => [...row]);

  for (let i = 0; i < numEquations; i++) {
    for (let j = i + 1; j < numEquations; j++) {
      const ratio = augmentedMatrix[j][i] / augmentedMatrix[i][i];
      for (let k = i; k < numVariables + 1; k++) { // Add 1 to include the constant term
        augmentedMatrix[j][k] -= ratio * augmentedMatrix[i][k];
      }
    }
  }

  // Check for no unique solution
  const hasZeroRowWithNonzeroEntry = augmentedMatrix.some(row => {
    const hasZeroToLeft = row.slice(0, numVariables).every(coefficient => coefficient === 0);
    const hasNonzeroToRight = row[numVariables] !== 0;
    return hasZeroToLeft && hasNonzeroToRight;
  });

  if (hasZeroRowWithNonzeroEntry) {
    solutionOutput.textContent = "No unique solution.";
    return;
  }

  const solution = new Array(numVariables).fill(0);

  for (let i = numEquations - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < numVariables; j++) {
      sum += augmentedMatrix[i][j] * solution[j];
    }

    solution[i] = (augmentedMatrix[i][numVariables] - sum) / augmentedMatrix[i][i];
  }

  const variables = Array.from({ length: numVariables }, (_, index) =>
    String.fromCharCode(97 + index)
  );

  for (let i = 0; i < numVariables; i++) {
    solutionOutput.textContent += `${variables[i]} = ${solution[i].toFixed(2)}\n`;
  }
}

// Function to find the inverse matrix
function findInverse(matrix) {
  const n = matrix.length;
  const inverse = new Array(n).fill(0).map(() => new Array(n).fill(0));

  // Initialize identity matrix
  for (let i = 0; i < n; i++) {
    inverse[i][i] = 1.0;
  }

  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    const leadingCoefficient = matrix[i][i];
    if (leadingCoefficient === 0) {
      return null; // Invalid. No inverse solution
    }

    for (let j = 0; j < n; j++) {
      matrix[i][j] /= leadingCoefficient;
      inverse[i][j] /= leadingCoefficient;
    }

    for (let k = 0; k < n; k++) {
      if (k !== i) {
        const multiplier = matrix[k][i];

        for (let j = 0; j < n; j++) {
          matrix[k][j] -= multiplier * matrix[i][j];
          inverse[k][j] -= multiplier * inverse[i][j];
        }
      }
    }
  }

  return inverse;
}

// Function to display the inverse matrix
function displayInverse(inverseMatrix) {
  const inverseOutput = document.getElementById("inverse-output");

  if (!inverseMatrix) {
    inverseOutput.innerHTML += "Inverse matrix doesn't exist.";
    return;
  }

  const matrixTable = document.createElement("table");
  const matrixBody = document.createElement("tbody");

  for (const row of inverseMatrix) {
    const tableRow = document.createElement("tr");

    for (const element of row) {
      const tableCell = document.createElement("td");
      tableCell.textContent = element.toFixed(1);
      tableRow.appendChild(tableCell);
    }

    matrixBody.appendChild(tableRow);
  }

  matrixTable.appendChild(matrixBody);
  inverseOutput.appendChild(matrixTable);
}
});