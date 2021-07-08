class SceneControls {
    constructor() {
        this.firstPartFloors = 5;
        this.secondPartFloors = 10;
        this.buildingColumnsAmount = 10;
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
}