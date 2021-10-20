class SceneControls {
    constructor() {
        this.firstPartFloors = 2;
        this.secondPartFloors = 3;
        this.buildingColumnsAmount = 10;
        this.craneLongRotation = 0;
        this.craneLoadLevel = 0;
        this.craneCabinRotation = 0;
        this.craneContraction = 0;
    }

    setChangeFirstPartFloors(n) {
        this.firstPartFloors = n;
    }

    setChangeSecondPartFloors(n) {
        this.secondPartFloors = n;
    }

    setChangeColumnsAmount(n) {
        this.buildingColumnsAmount = n;
    }

    setElevateCraneLoad() {
        if (this.craneLoadLevel > -20) {
            this.craneLoadLevel -= 1;
        }
    }

    setLowerCraneLoad() {
        if (this.craneLoadLevel < 10) {
        this.craneLoadLevel += 1;
        }
    }

    setRotateCraneCabinPositive() {
            this.craneCabinRotation += 1;
    }

    setRotateCraneCabinNegative() {
            this.craneCabinRotation -= 1;
    }

    setRotateCraneLongPositive() {
        if (this.craneLongRotation < 10) {
            this.craneLongRotation += 1;
        }
    }

    setRotateCraneLongNegative() {
        if (this.craneLongRotation > -5) {
            this.craneLongRotation -= 1;
        }
    }

    setContractCrane() {
        if (this.craneContraction < 30) {
            this.craneContraction += 1;
        }
    }

    setExpandCrane() {
        if (this.craneContraction > -1) {
        this.craneContraction -= 1;
        }
    }
}