const devtools = {
    godmode : function() {
        console.log("this will probably take a minute, don't close...");
        recipeList.recipes.forEach(recipe => {
            recipe.owned = true;
        })
        WorkerManager.workers.forEach(worker => {
            worker.owned = true;
            worker.lvl = 10;
        })
        ResourceManager.materials.forEach(material => {
            ResourceManager.addMaterial(material.id,100);
        })
        recipeList.recipes.forEach(recipe => {
            Inventory.addToInventory(recipe.id,0,10,true);
            Inventory.addToInventory(recipe.id,1,10,true);
            Inventory.addToInventory(recipe.id,2,10,true);
        })
        refreshInventory();
        refreshWorkers();
        examineHeroPossibleEquip();
        refreshRecipeFilters();
        console.log("done!");
    },
    materials : function() {
        ResourceManager.materials.forEach(material => {
            ResourceManager.addMaterial(material.id,10000);
        })
    },
    addGold(amt) {
        ResourceManager.addMaterial("M001",amt);
    },
    speed(amt) {
        player.timeWarp = amt;
    },
    workershorcut() {
        Inventory.addToInventory("R0201",0,10);
        Inventory.addToInventory("R0701",0,10);
        Inventory.addToInventory("R2101",0,10);
        ResourceManager.addMaterial("M001",10000);
    },
    monstercheck(floor,trials) {
        const results = {}
        while (trials > 0) {
            const mobName = MobManager.getMonster(floor).name;
            if (mobName in results) results[mobName] += 1;
            else results[mobName] = 1;
            trials -= 1;
        }
        console.log(results);
    }
}