package com.psccompanion;

import android.content.Intent;
import android.widget.RemoteViewsService;

public class ScrollableTimetableService extends RemoteViewsService {

    @Override
    public RemoteViewsFactory onGetViewFactory(Intent intent) {
        return (new ScrollableTimetableViewsFactory(this.getApplicationContext(), intent));
    }

}
