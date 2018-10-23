const devtools = {
    godmode : function() {
        recipeList.recipes.forEach(recipe => {
            recipe.owned = true;
            recipe.craftCount = 100;
        })
        WorkerManager.workers.forEach(worker => {
            worker.owned = true;
            worker.lvl = 10;
        })
        HeroManager.heroes.forEach(hero => {
            hero.owned = true;
            hero.lvl = 50;
        })
        ResourceManager.materials.forEach(material => {
            ResourceManager.addMaterial(material.id,9999999);
        })
        forceSave();
        location.replace('/');
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
    heroTest() {
        Inventory.addToInventory("R0101",0);
        Inventory.addToInventory("R0201",0);
        Inventory.addToInventory("R0301",0);
    },
    addItem(itemID, rarity) {
        Inventory.addToInventory(itemID,rarity,-1)
    }
}