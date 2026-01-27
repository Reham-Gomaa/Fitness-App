import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from "@angular/core";
import {ButtonModule} from "primeng/button";
import {DynamicDialogRef, DynamicDialogConfig} from "primeng/dynamicdialog";
import {FitnessFormRadio} from "@fitness-app/fitness-form";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

interface LevelOption {
    value: string;
    label: string;
}

@Component({
    selector: "app-level-modal",
    standalone: true,
    imports: [ButtonModule, FitnessFormRadio, TranslateModule],
    templateUrl: "./level-modal.html",
    styleUrl: "./level-modal.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelModal implements OnInit {
    private readonly dialogRef = inject(DynamicDialogRef);
    private readonly dialogConfig = inject(DynamicDialogConfig);
    private readonly translate = inject(TranslateService);

    readonly selectedActivityLevel = signal("level1");
    readonly activityLevelOptions = signal<LevelOption[]>([]);

    ngOnInit(): void {
        const currentLevel = this.dialogConfig.data?.currentActivityLevel;
        if (currentLevel) {
            this.selectedActivityLevel.set(currentLevel);
        }
        this.updateOptions();
    }

    onLevelChange(level: string): void {
        this.selectedActivityLevel.set(level);
    }

    onNext(): void {
        this.dialogRef.close(this.selectedActivityLevel());
    }

    close(): void {
        this.dialogRef.close(false);
    }

    private updateOptions(): void {
        const options: LevelOption[] = [
            {value: "level1", label: this.translate.instant("ACCOUNT.LEVEL.ROOKIE")},
            {value: "level2", label: this.translate.instant("ACCOUNT.LEVEL.BEGINNER")},
            {value: "level3", label: this.translate.instant("ACCOUNT.LEVEL.INTERMEDIATE")},
            {value: "level4", label: this.translate.instant("ACCOUNT.LEVEL.ADVANCED")},
            {value: "level5", label: this.translate.instant("ACCOUNT.LEVEL.TRUE_BEAST")},
        ];
        this.activityLevelOptions.set(options);
    }
}
