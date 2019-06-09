import olMap from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import Vector from 'ol/source/Vector';
import vector from 'ol/layer/Vector';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import OSM from 'ol/source/OSM.js';
import XYZ from 'ol/source/XYZ';
import {fromLonLat} from "ol/proj";
import {Feature}  from "ol";
import Overlay from 'ol/Overlay';
import {Icon, Style} from 'ol/style';
import { ServicesService } from './services.service';
import { Circle } from 'ol/geom';
import { LineString } from 'ol/geom';
import { Polygon } from 'ol/geom';

import { Text, Stroke } from "ol/style";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {


  map: olMap ;
  view: View;
  source: Vector;
  overlay: Overlay;
  layer: vector;
  @ViewChild('popup') myDiv: ElementRef;
  @ViewChild('popupcontent') cont: ElementRef;
  @ViewChild('close') closer: ElementRef;

  cords = [
            [22.6043701171875,38.99267578125001],
            [22.4043701171875,38.69267578125001],
            [22.3043701171875,38.49267578125001]
          ];


  constructor(public services: ServicesService, private elementRef:ElementRef){
  }

  ngOnInit(): void {

    this.source = new Vector({});

    this.layer = new vector({source: this.source});

    this.overlay = new Overlay({
      element: this.myDiv.nativeElement,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });

    // const osmLayer = new TileLayer({
    //   source: new OSM()
    // });

    const xyzLayer = new TileLayer({
      source: new XYZ({
        url: 'http://tile.osm.org/{z}/{x}/{y}.png'
      })
    });

    this.view = new View({
      projection: 'EPSG:4326',
      center: [23.9501953125,38.17968750000001],
      zoom: 8
    });

    this.map = new olMap({
      target: 'map',
      layers: [
        //osmLayer,
        xyzLayer,
        this.layer
      ],
      overlays: [this.overlay],
      view: this.view
    });

    var iconStyle = new Style({
            image: new Icon(/** @type {module:ol/style/Icon~Options} */ ({
            anchor: [0.8, 50],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: 'assets/airplane.png'
          }))
        });

    this.cords.forEach((value) => {
        var marker= new Feature({
           geometry: new Point(value)
        });
        marker.setStyle(iconStyle);
        this.source.addFeature(marker);
        this.source.addFeature(new Feature(new Circle(value,0.4)));
       });

    this.map.on('click', (event)=>{
        console.log(event.coordinate);
          this.cont.nativeElement.innerHTML = '<p>You clicked here:</p><code>' + event.coordinate + '</code>';
          this.overlay.setPosition(event.coordinate);
          });

    const line = new Feature({
      geometry: new LineString(this.cords)
    });
    const lineStyle = new Style({
      stroke: new Stroke({
        color: 'rgba(0,0,0,0.4)',
        width: 3
        // lineDash: [4,8]
      })
    });
    line.setStyle(lineStyle);
    this.source.addFeature(line);

  }

  closeOnClick() {
    this.overlay.setPosition(undefined);
    this.closer.nativeElement.blur();
    return false;
  }



}
