export class StockExchangeIndex {
  private indexName:string;
  private rsi: number;
  private historicalData: any;


  constructor(historicalData: any,name:string) {
    console.log("create: ",name);
    this.indexName=name;
    this.historicalData=historicalData;
    this.calculateRsi(14)
  };

  calculateRsi(period:number){
     let sumGain:number=0;
     let sumLoss:number=0;

    for (var i = 1; i < period+1; i++) {
      var difference = Number(this.historicalData[i].close) - Number(this.historicalData[i-1].close);

      if(difference >= 0){
        sumGain += difference;
      }else{
        sumLoss -= difference;

      }

    }
    console.log("sumGain", sumGain);
    console.log("sumLoss", sumLoss);

    var relativeStrength = Math.abs((sumGain/period )/ (sumLoss/period));

    console.log("rs",relativeStrength);
    this.rsi=100.0 - (100.0 / (1 + relativeStrength));
    console.log("rsi",this.rsi);

  }

  public getRsi() {

    return this.rsi;
  }

}
;
