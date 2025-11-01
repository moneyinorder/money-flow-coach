import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Home, AlertCircle, Info } from "lucide-react";

export const MortgageCalculator = () => {
  const [debtAmount, setDebtAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [termYears, setTermYears] = useState("");
  const [monthlySavings, setMonthlySavings] = useState("");
  const [investmentReturn, setInvestmentReturn] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [result, setResult] = useState<{
    investingTotal: number;
    payingDebtTotal: number;
    difference: number;
    recommendation: string;
  } | null>(null);

  const calculateComparison = () => {
    const principal = parseFloat(debtAmount);
    const rate = parseFloat(interestRate) / 100;
    const years = parseFloat(termYears);
    const monthly = parseFloat(monthlySavings);
    const invReturn = parseFloat(investmentReturn) / 100;
    const tax = parseFloat(taxRate) / 100 || 0;

    if (!principal || !rate || !years || !monthly || !invReturn) {
      return;
    }

    const months = years * 12;
    const monthlyRate = rate / 12;
    const invMonthlyRate = invReturn / 12;
    
    // Calculate minimum monthly payment for the debt
    const minPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                       (Math.pow(1 + monthlyRate, months) - 1);

    // Scenario 1: Invest the extra money
    // Pay minimum on debt, invest the rest
    const extraForInvesting = monthly - minPayment;
    let investingBalance = 0;
    let remainingDebt = principal;
    
    for (let i = 0; i < months; i++) {
      // Pay minimum on debt
      const interest = remainingDebt * monthlyRate * (1 - tax); // Tax deduction on mortgage interest
      const principalPayment = minPayment - (remainingDebt * monthlyRate);
      remainingDebt -= principalPayment;
      
      // Invest the extra
      if (extraForInvesting > 0) {
        investingBalance = (investingBalance + extraForInvesting) * (1 + invMonthlyRate);
      }
    }
    const investingTotal = investingBalance;

    // Scenario 2: Pay down debt aggressively
    // Use all available money to pay down debt first, then invest
    let debtBalance = principal;
    let savingsBalance = 0;
    let debtPaidOff = false;
    let monthPaidOff = 0;
    
    for (let i = 0; i < months; i++) {
      if (!debtPaidOff && debtBalance > 0) {
        const interest = debtBalance * monthlyRate * (1 - tax);
        const principalPayment = Math.min(monthly - interest, debtBalance);
        debtBalance -= principalPayment;
        
        const leftover = monthly - interest - principalPayment;
        if (leftover > 0) {
          savingsBalance = (savingsBalance + leftover) * (1 + invMonthlyRate);
        }
        
        if (debtBalance <= 0) {
          debtPaidOff = true;
          monthPaidOff = i;
        }
      } else {
        // Debt is paid off, invest everything
        savingsBalance = (savingsBalance + monthly) * (1 + invMonthlyRate);
      }
    }
    const payingDebtTotal = savingsBalance;

    const difference = investingTotal - payingDebtTotal;
    const recommendation = difference > 0 
      ? "Investing while paying minimum on debt yields higher returns"
      : "Paying down debt aggressively yields better results";

    setResult({
      investingTotal,
      payingDebtTotal,
      difference: Math.abs(difference),
      recommendation
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <Home className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Invest vs Pay Down Debt Calculator</CardTitle>
        <CardDescription>
          Compare the financial outcomes of investing versus paying down debt aggressively
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Educational purposes only.</strong> This tool provides general calculations and should not be considered financial advice. 
            Consult with a financial advisor for personalized guidance.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="debtAmount">Total Debt Amount ($)</Label>
            <Input
              id="debtAmount"
              type="number"
              placeholder="300000"
              value={debtAmount}
              onChange={(e) => setDebtAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate on Debt (%)</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              placeholder="6.5"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="termYears">Term of Debt (years)</Label>
            <Input
              id="termYears"
              type="number"
              placeholder="30"
              value={termYears}
              onChange={(e) => setTermYears(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlySavings">Monthly Amount Available ($)</Label>
            <Input
              id="monthlySavings"
              type="number"
              placeholder="3000"
              value={monthlySavings}
              onChange={(e) => setMonthlySavings(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentReturn">Expected Investment Return (%)</Label>
            <Input
              id="investmentReturn"
              type="number"
              step="0.1"
              placeholder="8"
              value={investmentReturn}
              onChange={(e) => setInvestmentReturn(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxRate">Tax Rate (% - for mortgage interest deduction)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.1"
              placeholder="25"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={calculateComparison} className="w-full">
          Calculate Comparison
        </Button>

        {result && (
          <div className="space-y-4 mt-6 p-4 bg-secondary/20 rounded-lg">
            <h3 className="font-semibold text-lg">Results After {termYears} Years</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Investing Strategy</h4>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ${result.investingTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pay minimum on debt, invest the rest
                </p>
              </div>

              <div className="p-4 bg-background rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="h-5 w-5 text-primary" />
                  <h4 className="font-semibold">Debt Payoff Strategy</h4>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ${result.payingDebtTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pay down debt first, then invest
                </p>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Difference:</strong> ${result.difference.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                <br />
                <strong>Recommendation:</strong> {result.recommendation}
              </AlertDescription>
            </Alert>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Beyond the Numbers:</strong> While one strategy may yield higher returns mathematically, 
                consider your personal circumstances. If you're nearing retirement, have uncertain employment, 
                or simply value the peace of mind that comes with being debt-free, paying down your mortgage 
                can still be the better choice. Financial security and reduced risk are valuable benefits that 
                aren't always reflected in pure dollar calculations.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
