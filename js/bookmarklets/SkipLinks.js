function replaceGetElementsByName(searchName) {

        // getElementsByName doesn't
        // work the same in all browsers
        // this copies how it worked in IE 6
        // in all browsers

        // so it returns list of all elements
        // with searchName as name OR AS id

	var myNameElements = new Array();
	var els = document.getElementsByTagName('*');
	var elsLen = els.length;
	var pattern = new RegExp('(^|\\\\s)'+searchName+'(\\\\s|$)');
	for (s = 0, j = 0; s < elsLen; s++) {
		if ( pattern.test(els[s].name) || pattern.test(els[s].id) ) {
			myNameElements[j] = els[s];
			j++;
		}
	}
	return myNameElements;
}



function AnchorsForSkip(){

    //create object just to check length of the properties array
    var jt_generic_obj = document.createElement("var");
    var jt_ie7 = false;
    if (jt_generic_obj.attributes.length > 0) {
        jt_ie7 = true;
    }

    //remove what was added by favelet
    var idi;
    var myExpress1 = /SKIPstAdded.*/;
    var spanLive=document.getElementsByTagName('span');
    //static (span won't change - don't use spanLive while editing page)
    var spans = new Array();
    for (var i=0; i<spanLive.length;i++) {
         spans[i] = spanLive[i];
    }
    for (var s=0;s<spans.length;s++) {
        if (((jt_ie7 && spans[s].attributes && spans[s].attributes.id.specified) || (!(jt_ie7) && spans[s].hasAttribute('id'))) && myExpress1.test(spans[s].getAttribute('id'))) {
             spans[s].parentNode.removeChild(spans[s]);
        }
    }

    var z=0, w, str='', count=0, anchors=0, missing=0, error=0, good=0; 
    var name='';
    var names=new Array();
    var v=new Array();
    var pre='<span style=\'color:';
    var next=';font:small; font-weight:bold;background:#ffefd5;';
    t=document.getElementsByTagName('a');
    for (i=0;i<t.length;i++) {
        var l,o="",x=0, na=0, u=0; var message="";
        if ((jt_ie7 && t[i].attributes.href.specified) || (!(jt_ie7) && t[i].hasAttribute('href')))
 {
            var h=t[i].href;
            u=h.indexOf('#');
            if (u>=0) {  /* gotta do something*/
                // alert('found '+h);
                name=h.substring(u+1,h.length);
                if (name.length>0) {
                    var file=h.substr(0,u);
                    var url=document.URL;
                    var u=url.indexOf('#');
                    if (u>0) url=url.substr(0,u);
                    // alert(file.indexOf('file')+' found # '+file+' compared with '+url);
                    // I don't remember the reason for this test but I wasn't finding local anchors in files
                    // vecause the brgin file://C: ... and file:/// C: ... so are alwayd different 
                    // I added the condition that goes ahead an assumes OK if file!
                    if (file==url || file.indexOf('file')==0 ) {
                        // Local Anchor
                        count++;  //same throughout favelet run
                        
                        //found becomes true if 
                        //  name is in names array
                        //  It seems to be to avoid
                        //  addressing same anchor more than once
                        found=false;k=0;
                        while (!found && k<names.length) {
                            found=(name==names[k]);
                            k++;
                        }

                        
                        if (!found) {
                            anchors++
                            names[k]=name;
                            // alert( 'local anchor name=\"'+name+'\"');
                            v=replaceGetElementsByName(name);   //all elements with that name or id
                            w=v[0]; //first element with that name or id
                            //alert ("v is " + v);
                            //alert ("w is " + w);
                            //alert ("in reusable variable " + v.length);
                            //alert ("directly " + replaceGetElementsByName(name).length);

                            if (v.length < 1) {

                                //no anchor with that name!
                                found = true; //nothing to outline
                                var message = '<span style=\"color:#C00000;\"> with no target</span>';
                                missing++;

                            } else {

                                //create span to hold message for intended target
                                var intended = document.createElement('span');
                                intended.style.fontWeight="bold";
                                intended.style.fontSize="small";
                                intended.style.backgroundColor="#FFEFD5";
                                intended.style.margin="2px";
                                intended.style.fontFamily="arial,sans-serif";
                                intended.id = 'SKIPstAdded'+(idi++);

                                //Adding section just to check original target
                                     var layout1 = false;
                                     try {layout1=w.currentStyle.hasLayout;}
                                     catch (err) {
                                     }
                                     if (w.getAttribute('tabindex') == '-1' || layout1) {
                                        //will be okay in IE 6-8
                                        layout1=true;
                                        good++;
                                        var tt=document.createTextNode('<Target for #'+name+'>'); 
                                        intended.style.color='navy';
                                     } else {
                                        var tt=document.createTextNode('<Intended target for #'+name+'>');
                                        intended.style.color='navy';
                                     }

                                    //w.style.color='red';
                                    //w.style.display='inline-block';
                                    //w.style.width="100%"
                                    //w.style.height="144px";

                                //outline intended target
                                w.style.padding='3px';
                                w.style.border='4px solid navy';
                                w.appendChild(tt);

                                //makes anchors positioned over each other show up
                                //w.style.position='static';
                                
//alert("pause2")
                                //add message to intended target
                                intended.appendChild(tt);

                                var firstthing = w.childNodes[0];
                                if (firstthing == undefined) {firstthing = null};
                                //if the second arg is null, insertBefore just adds the object to the parent
                                //in IE, if the second arg is undefined, an error is thrown
                                //so we account for that just above
                                w.insertBefore(intended,firstthing);

                                //coming out of section below w is adjusted to the target in IE 6-8
                                // if and only if favelet is run in IE

                                layout=false;
                                while (!layout && (w.tagName != 'BODY')) {
                                    //alert( w.tagName);
                                    try {layout=w.currentStyle.hasLayout;}
                                    catch (err) {
                                    }
                                    //case where it isn't layout but is 
                                    //tabindex -1
                                    if (!layout && w.getAttribute('tabindex') == '-1') {
                                        layout=true;
                                    }
                                    if (!layout) w=w.parentNode;
                                }

                            }
                            //Found ancestor with haslayout=true.
                            //or body element
                            //or anchor itself with tabindex neg one
                            str='target for #'+name;
                        }
                        l='href=\"#'+name+'\"'; x++;
                    }
                }
            }


            // it seems that x is greater than zero if this link is
            // a local anchor

            if ( x>0) {
                //alert('line 48');

                //need to highlight where the in page link is
                var thelink = document.createElement('span');
                thelink.style.fontWeight="bold";
                thelink.style.fontSize="small";
                thelink.style.backgroundColor="#FFEFD5";
                thelink.style.margin="2px";
                thelink.style.fontFamily="arial,sans-serif";
                thelink.style.color='navy';
                thelink.id = 'SKIPstAdded'+(idi++);


                //need the link text
                var linkText='';

                //get text nodes directly in the link
                //since getElementsByTagName will skip them
                var thingsInLink=t[i].childNodes;
                for (p=0;p<thingsInLink.length;p++) {
                     if (thingsInLink[p].nodeType==3) {
                          linkText = linkText + thingsInLink[p].nodeValue;                           }
                }

                //use get ElementsByTagName to get whole subtree of elements
                var thingsInLink=t[i].getElementsByTagName("*");
               
                for (p=0;p<thingsInLink.length;p++) {
                    if (((jt_ie7 && thingsInLink[p].attributes && thingsInLink[p].attributes.id.specified) || (!(jt_ie7) && thingsInLink[p].hasAttribute('id'))) && !myExpress1.test(thingsInLink[p].getAttribute('id'))) {
                        //textNodes don.t show up in the list
                        //so get them with childNodes
                        var tN = thingsInLink[p].childNodes;
                        for (l=0;l<tN.length;l++) {
//alert(tN[l].tagName);
                            if (tN[l].nodeType==3) {
                                linkText = linkText + tN[l].nodeValue;
                            }
                        }
                    }
                    //Checks for images, no matter how nested
                    if (thingsInLink[p].tagName.toLowerCase()=='img' && ((jt_ie7 && thingsInLink[p].attributes.alt.specified) || (!(jt_ie7) && thingsInLink[p].hasAttribute('alt')))) {
                           linkText = linkText + thingsInLink[p].alt;
                    }
                }
            


                var ltt=document.createTextNode(' <Inpage Link: "'+linkText+'" href="#'+name+'">'); 
                thelink.appendChild(ltt);
                //var firstthing = w.childNodes[0];
                //if (firstthing == undefined) {firstthing = null};
                   //if the second arg is null, insertBefore just adds the object to the parent
                   //in IE, if the second arg is undefined, an error is thrown
                   //so we account for that just above
                t[i].parentNode.insertBefore(thelink,t[i]);

                //makes links positioned over each other show up
                //used t[i] first, but that could change test results
                //thelink is just the span added by the favelet 
                thelink.parentNode.style.position='static';
                thelink.style.position='static';

                //maybe can show em
                t[i].focus(); //shows last one
                //t[i].setAttribute('onBlur','return false'); 

//alert("pause");


                //var h=t[i].outerHTML;
                //t[i].outerHTML='<span style=\"color:navy;font:small arial;background:#FFEFD5;\"><b>&lt;Inpage Link '+l+message+'&gt;</b></span><br>'+h;
                //alert('line 51');
                t[i].style.padding='3px';
                t[i].style.border='1px solid red';
                //alert('line 54');

                //outlining when target is different from intended target
                if (!found && !layout1) {

                   //create span to hold message for intended target
                   var nintended = document.createElement('span');
                   nintended.style.fontWeight="bold";
                   nintended.style.fontSize="small";
                   nintended.style.backgroundColor="#FFEFD5";
                   nintended.style.margin="2px";
                   nintended.style.fontFamily="arial,sans-serif";
                   nintended.id = 'SKIPstAdded'+(idi++);

                   var ntt=document.createTextNode('<Target for #'+name+' in IE 6-8>');
                   nintended.style.color='#C00000';
                   nintended.appendChild(ntt);


                   var firstthing = w.childNodes[0];
                   if (firstthing == undefined) {firstthing = null};
                   //if the second arg is null, insertBefore just adds the object to the parent
                   //in IE, if the second arg is undefined, an error is thrown
                   //so we account for that just above
                   w.insertBefore(nintended,firstthing);


                    //var h1=w.innerHTML;
                    //if (w.tagName!='A') {
                        //alert ('target is A: '+h1);
                    //    w.innerHTML=pre+'navy'+next+'\'>&lt;'+str+'&gt;</span> <div>'+h1+'</div>';
                    //} else {
                        //var h2=w.outerHTML;
                        //w.outerHTML=pre+'navy'+next+'\'>&lt;'+str+'&gt;</span>'+h2;
                    //}
                    w.style.padding='3px';
                    w.style.border='4px dashed #C00000';
                    //makes anchors positioned over each other show up
                    //w.style.position='static';
                }
                
                //outlining of orginal (intended) target

                if (h!='')z=z+1;
            }
        }
    }
    if (count==0) {
        alert('No Local anchors');
    } else {
        if (missing > 0) {
            var jt_dif = count-missing;
            //alert(missing + ' local anchors without a target. ' + jt_dif + ' local anchors to check out.');
            alert(count+' in page links and '+ anchors+' related anchors. '+missing+' in page links without a target. \n\n'+ good+' exact matches\n'+(anchors-good)+' to check out');

        } else {
            alert(count+' in page links and '+ anchors+' related anchors\n\n'+ good+' exact matches\n'+(anchors-good)+' to check out');
        }
    }
}
AnchorsForSkip();

//Feb 2013
// checks for tabindex="-1" up the tree
// outlines intended target

