import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as go from 'gojs';
import { AppService } from 'src/app/services/app.service';
import { take, tap } from 'rxjs';
import { Database } from 'src/app/interfaces/database.interface';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-viewer',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent {
  make = go.GraphObject.make;

  myDiagram!: go.Diagram;

  fieldTemplate!: any;

  constructor(
    private appService: AppService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show(undefined, { fullScreen: true });
    this.appService
      .getAllDatabase()
      .pipe(
        take(1),
        tap((databaseJson) => {
          const nodeArray = this.mapToNodeArray(databaseJson);
          this.initDiagram(nodeArray);
        })
      )
      .subscribe();
  }

  mapToNodeArray(databaseJson: Database): any[] {
    let tables: [] = [];
    databaseJson.tables.forEach((table) => {
      let fields: { name: string; info: string }[] = [];
      table.fields.forEach((field) => {
        const newField = {
          name: field.name,
          info:
            (field.optional ? field.type + '?' : field.type) +
            ' ' +
            field.restriction,
        };

        fields.push(newField);
      });
      const newTable = {
        key: table.name,
        widths: [NaN, NaN, 60],
        fields: fields,
      };
      tables.push(newTable as never);
    });
    return tables;
  }

  initDiagram(nodeArray: any[]) {
    this.myDiagram = this.make(go.Diagram, 'myDiagramDiv', {
      validCycle: go.Diagram.CycleNotDirected, // don't allow loops
      'undoManager.isEnabled': true,
    });

    this.fieldTemplate = this.make(
      go.Panel,
      'TableRow',
      new go.Binding('portId', 'name'),
      {
        background: 'transparent', // so this port's background can be picked by the mouse
        fromSpot: go.Spot.Right, // links only go from the right side to the left side
        toSpot: go.Spot.Left,
        // allow drawing links from or to this port:
        fromLinkable: true,
        toLinkable: true,
      },
      this.make(
        go.Shape,
        {
          column: 0,
          width: 12,
          height: 12,
          margin: 4,
          // but disallow drawing links from or to this shape:
          fromLinkable: false,
          toLinkable: false,
        },
        new go.Binding('figure', 'figure'),
        new go.Binding('fill', 'color')
      ),
      this.make(
        go.TextBlock,
        {
          column: 1,
          margin: new go.Margin(0, 2),
          stretch: go.GraphObject.Horizontal,
          font: 'bold 13px sans-serif',
          wrap: go.TextBlock.None,
          overflow: go.TextBlock.OverflowEllipsis,
          // and disallow drawing links from or to this text:
          fromLinkable: false,
          toLinkable: false,
        },
        new go.Binding('text', 'name')
      ),
      this.make(
        go.TextBlock,
        {
          column: 2,
          margin: new go.Margin(0, 2),
          stretch: go.GraphObject.Horizontal,
          font: '13px sans-serif',
          maxLines: 3,
          overflow: go.TextBlock.OverflowEllipsis,
          editable: true,
        },
        new go.Binding('text', 'info').makeTwoWay()
      )
    );

    // This template represents a whole "record".
    this.myDiagram.nodeTemplate = this.make(
      go.Node,
      'Auto',
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      // this rectangular shape surrounds the content of the node
      this.make(go.Shape, {
        fill: '#EEEEEE',
      }),
      // the content consists of a header and a list of items
      this.make(
        go.Panel,
        'Vertical',
        {
          stretch: go.GraphObject.Horizontal,
          alignment: go.Spot.TopLeft,
        },
        // this is the header for the whole node
        this.make(
          go.Panel,
          'Auto',
          {
            stretch: go.GraphObject.Horizontal,
          },
          this.make(go.Shape, {
            fill: '#1570A6',
            stroke: null,
          }),
          this.make(
            go.TextBlock,
            {
              alignment: go.Spot.TopLeft,
              margin: 3,
              stroke: 'white',
              textAlign: 'center',
              font: 'bold 12pt sans-serif',
            },
            new go.Binding('text', 'key')
          )
        ),
        this.make(
          go.Panel,
          'Table',
          {
            name: 'TABLE',
            stretch: go.GraphObject.Horizontal,
            minSize: new go.Size(100, 10),
            defaultAlignment: go.Spot.Left,
            defaultStretch: go.GraphObject.Horizontal,
            defaultColumnSeparatorStroke: 'gray',
            defaultRowSeparatorStroke: 'gray',
            itemTemplate: this.fieldTemplate,
          },
          new go.Binding('itemArray', 'fields')
        )
      )
    );

    this.myDiagram.linkTemplate = this.make(
      go.Link,
      {
        relinkableFrom: true,
        relinkableTo: true,
        toShortLength: 4,
      }, // let user reconnect links
      this.make(go.Shape, {
        strokeWidth: 1.5,
      }),
      this.make(go.Shape, {
        toArrow: 'Standard',
        stroke: null,
      })
    );

    this.myDiagram.model = this.make(go.GraphLinksModel, {
      copiesArrays: true,
      copiesArrayObjects: true,
      linkFromPortIdProperty: 'fromPort',
      linkToPortIdProperty: 'toPort',
      // automatically update the model that is shown on this page
      Changed: (e: any) => {
        // if (e.isTransactionFinished) this.showModel();
      },
      nodeDataArray: nodeArray,
      linkDataArray: [
        // {
        //   from: 'Record1',
        //   fromPort: 'field1',
        //   to: 'Record2',
        //   toPort: 'fieldA',
        // },
        // {
        //   from: 'Record1',
        //   fromPort: 'field2',
        //   to: 'Record2',
        //   toPort: 'fieldD',
        // },
        // {
        //   from: 'Record1',
        //   fromPort: 'fieldThree',
        //   to: 'Record2',
        //   toPort: 'fieldB',
        // },
      ],
    });
    setTimeout(() => {
      this.spinner.hide();
    }, 500);
    // this.showModel();
  }

  makeWidthBinding(idx: number) {
    return [
      {
        column: idx,
      },
      new go.Binding('width', 'widths', (arr) => {
        if (Array.isArray(arr) && idx < arr.length) return arr[idx];
        return NaN;
      }).makeTwoWay((w, data) => {
        let arr = data.widths;
        if (!arr) arr = [];
        if (idx >= arr.length) {
          for (let i = arr.length; i <= idx; i++) arr[i] = NaN;
        }
        arr[idx] = w;
        return arr;
      }),
    ];
  }

  showModel() {
    document!.getElementById('mySavedModel')!.textContent =
      this.myDiagram.model.toJson();
  }
}
