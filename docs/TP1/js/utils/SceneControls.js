class SceneControls {
    constructor() {
        this.firstPartFloors = 5;
        this.secondPartFloors = 10;
        this.buildingColumnsAmount = 10;
        this.craneLongRotation = 0;
        this.craneLoadLevel = 0;
        this.craneCabinRotation = 0;
        this.craneContraction = 0;
    }

    setChangeFirstPartFloors(n) {
        this.changeFirstPartFloors = true;
        this.firstPartFloors = n;
    }

    setChangeSecondPartFloors(n) {
        this.changeSecondPartFloors = true;
        this.secondPartFloors = n;
    }

    setChangeColumnsAmount(n) {
        this.changeBuildingColumns = true;
        this.buildingColumnsAmount = n;
    }

    setElevateCraneLoad() {
        this.craneLoadLevel -= 1;
    }

    setLowerCraneLoad() {
        this.craneLoadLevel += 1;
    }

    setRotateCraneCabinPositive() {
        this.craneCabinRotation += 1;
    }

    setRotateCraneCabinNegative() {
        this.craneCabinRotation -= 1;
    }

    setRotateCraneLongPositive() {
        this.craneLongRotation += 1;
    }

    setRotateCraneLongNegative() {
        this.craneLongRotation -= 1;
    }

    setContractCrane() {
        this.craneContraction += 1;
    }

    setExpandCrane() {
        this.craneContraction -= 1;
    }
}