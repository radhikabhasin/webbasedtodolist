require(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojarraytabledatasource', 'ojs/ojbutton', 'ojs/ojinputtext'],
function(oj, ko, $)
{     
    var TodoListModel = function () 
    
    {
        this.itemToAdd = ko.observable("");
     
        this.allItems = ko.observableArray([{"id": 0, "item": "To Do 1"},
                                            {"id": 1, "item": "To Do 2"}, 
                                            {"id": 2, "item": "To Do 3"},
                                            {"id": 3, "item": "To Do 4 "}
                                           ]);
        this.selectedItems = ko.observableArray([]);
        var lastItemId = this.allItems().length;
 
        this.dataSource = new oj.ArrayTableDataSource(this.allItems, {idAttribute: "id"});

        this.addItem = function () 
        {
            if ((this.itemToAdd() != "") && (this.allItems.indexOf(this.itemToAdd()) < 0)) 
            {
                lastItemId++;
                this.allItems.push({"id": lastItemId-1, "item": this.itemToAdd()});
            }
            this.itemToAdd("");
         
        };

        var self = this; 
        this.removeSelected = function () 
        {
            $.each(this.selectedItems(), function(index, value)
            {
                self.allItems.remove(function(item)
                {
                    return (item.id == value);
                });
            });
        }; 
      
       
       var moveItem = function(index,id,delta) 
       {
         var oldIndex = self.allItems.indexOf(self.allItems()[id]);
         var newIndex = id + delta;
         
          if (newIndex < 0  || newIndex == lastItemId)
              return; //if already at the top or bottom of the array
         
          var indexes = [oldIndex, newIndex].sort(); //Sort the indixes
          var oldVal = self.allItems()[indexes[0]];
          var newVal = self.allItems()[indexes[1]];
         
         self.allItems.splice(indexes[0],2,newVal, oldVal); 
      };
      
      
      self.buttonUpClick = function(data, event){
        $.each(this.selectedItems(), function(index, value)
               {
               moveItem(index, value, -1);
            });
        return true;
    }
      
      
      self.buttonDownClick = function(data, event){
        
         $.each(this.selectedItems(), function(index, value)
            {
                moveItem(index, value, 1);
            });
        return true;
    }

        this.updateSelected = function () 
        {
            $.each(this.selectedItems(), function(index, value)
            {
                self.dataSource.change({"id": value, "item": self.itemToAdd()});
            });
        }; 
    };

    $(
        function() 
        {
            ko.applyBindings(new TodoListModel(), document.getElementById('listViewContainer'));
        }
    );
});	
